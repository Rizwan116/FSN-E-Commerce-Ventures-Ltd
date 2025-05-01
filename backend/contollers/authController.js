import { sql_queries } from '../sql_queries.js';
import { pgClient } from '../postgres_db.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^.{6,}$/;


export const register = async (req, res) => {
    try {
        // Destructure directly from req.body
        const { email, password, firstName, lastName, phone } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Create user in database using the SQL query
        const result = await pgClient.query(sql_queries.createUserQuery, [
            firstName,
            lastName,
            email,
            password,
            phone || ''
        ]);

        res.status(200).json({
            success: true,
            message: 'User registered successfully',
            userId: result.rows[0].id
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Check for duplicate email
        if (error.code === '23505') { // PostgreSQL unique violation error code
            return res.status(409).json({
                success: false,
                message: 'Email/Phone already exists',
                error: error.message
            });
        }

        
        res.status(500).json({
            success: false,
            message: 'Error during registration',
            error: error.message
        });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: '❗ Enter a valid email' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, message: '❗ Password must be at least 6 characters' });
    }

    try {
        const result = await pgClient.query(sql_queries.checkUserQuery, [email, password]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.status(200).json({
                success: true,
                message: 'Login successful',
                userId: user.id,
                email: user.email,
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName,
                profile_image: user.profile_image,
            });
        } else {
            res.status(401).json({ success: false, message: '❌ Invalid email or password' });
        }
    } catch (err) {
        console.error('Error connecting to the database', err.stack);
        return res.status(500).json({ success: false, message: 'Error connecting to the database' });
    }
}
    


//   const Login = () => {
//     const { login } = useContext(AuthContext);
//     const [form, setForm] = useState({ email: '', password: '' });
//     const navigate = useNavigate();
  
//     const handleChange = (e) => {
//       setForm({ ...form, [e.target.name]: e.target.value });
//     };
  
//     const validate = async () => {

  
      
//       try {
//         const dbRef = ref(database);
//         const snapshot = await get(child(dbRef, 'users'));
  
//         if (snapshot.exists()) {
//           const users = snapshot.val();
  
//           // Find matching user with email and password
//           const userKey = Object.keys(users).find((key) => {
//             const user = users[key];
//             return user.email === form.email && user.password === form.password;
//           });
  
//           if (userKey) {
//             const matchedUser = users[userKey];
  
//             // Save full user object including phone to localStorage
//             localStorage.setItem('user', JSON.stringify(matchedUser));
  
//             // Optionally call context login method if you're using AuthContext
//             login(matchedUser);
  
//             alert('✅ Login successful!');
//             navigate('/');
//           } else {
//             alert('❌ Incorrect email or password');
//           }
//         } else {
//           alert('❌ No users found in database');
//         }
//       } catch (error) {
//         console.error("Login error:", error);
//         alert('⚠️ Login failed. Please try again later.');
//       }
//     };



export const logout = async (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        success: true,
        message: `Logout successfully`,
    });
}