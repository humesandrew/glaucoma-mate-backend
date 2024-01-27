const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate user using Firebase Authentication REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAts5SVgRfuCSV3kXNFOjWPsPd5hfX-TYY
      `,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message);
    }

    // Check if the user exists in the database
    let user = await User.findByEmail(email);

    if (!user) {
      // If the user doesn't exist, create a new user in the database
      const userRecord = await admin.auth().getUserByEmail(email);
      user = await User.signup(email, userRecord.uid);
    }

    // Respond with the user data and the Firebase token
    res.status(200).json({ email, firebaseToken: data.idToken, user_id: user._id });
  } catch (error) {
    console.error('Error during Firebase login:', error);
    res.status(400).json({ error: error.message });
  }
};
