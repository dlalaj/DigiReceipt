import 'package:digi_receipts/auth_api.dart';
import 'package:digi_receipts/pages/navigator.dart';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  Future<void> _signIn() async {
    // Call signIn method

    final username = usernameController.text;
    final password = passwordController.text;
    final authApi = AuthApi(baseUrl: 'http://10.0.2.2:5000');

    final result = await authApi.signIn(username, password);

    if (result == null) {
      // Display message to indicate that username is taken
      showDialog(
        // ignore: use_build_context_synchronously
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20.0),
            ),
            title: const Text(
              'Warning',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.red,
                fontWeight: FontWeight.bold,
                fontSize: 24.0,
              ),
            ),
            content: const Text(
              'Incorrect password entered!',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.black,
                fontSize: 18.0,
              ),
            ),
            actionsPadding: const EdgeInsets.all(16.0),
            actions: <Widget>[
              TextButton(
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.all(Colors.red),
                  foregroundColor: MaterialStateProperty.all(Colors.white),
                ),
                child: const Text(
                  'OK',
                  style: TextStyle(
                    fontSize: 18.0,
                  ),
                ),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    } else {
      // Check if login succeeded and navigate or show error
      print("Saving preferences");
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString("username", result["username"]);
      prefs.setString("token", result["token"]);
      print("Done saving preferences");
      // Navigate to new page
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => NavigatorPage()),
        (Route<dynamic> route) => false, // Remove all routes below the NavigatorPage
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign In')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: Column(
            children: [
              TextField(
                controller: usernameController,
                decoration: const InputDecoration(labelText: 'Username'),
              ),
              TextField(
                controller: passwordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Password'),
              ),
              Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _signIn,
                          child: const Text('Sign In'),
                        ),
                      ),
                      const SizedBox(width: 12), // spacing between buttons
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => const SignUpPage()),
                            );
                          },
                          child: const Text('Sign Up'),
                        ),
                      ),
                    ],
                  )),
            ],
          ),
        ),
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: const Center(
        child: Text('Welcome!'),
      ),
    );
  }
}

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  Future<void> _signUp() async {
    // Call signIn method
    final username = usernameController.text;
    final password = passwordController.text;
    final authApi = AuthApi(baseUrl: 'http://10.0.2.2:5000');

    final result = await authApi.signUp(username, password);
    if (result == null) {
      // Display message to indicate that username is taken
      showDialog(
        // ignore: use_build_context_synchronously
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20.0),
            ),
            title: const Text(
              'Warning',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.red,
                fontWeight: FontWeight.bold,
                fontSize: 24.0,
              ),
            ),
            content: const Text(
              'Username in use!',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.black,
                fontSize: 18.0,
              ),
            ),
            actionsPadding: const EdgeInsets.all(16.0),
            actions: <Widget>[
              TextButton(
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.all(Colors.red),
                  foregroundColor: MaterialStateProperty.all(Colors.white),
                ),
                child: const Text(
                  'OK',
                  style: TextStyle(
                    fontSize: 18.0,
                  ),
                ),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    } else {
      // ignore: use_build_context_synchronously
      showDialog(
        // ignore: use_build_context_synchronously
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20.0),
            ),
            title: const Text(
              'Success',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.green,
                fontWeight: FontWeight.bold,
                fontSize: 24.0,
              ),
            ),
            content: const Text(
              'Account created successfully! Continue to login page!',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.black,
                fontSize: 18.0,
              ),
            ),
            actionsPadding: const EdgeInsets.all(16.0),
            actions: <Widget>[
              TextButton(
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.all(Colors.green),
                  foregroundColor: MaterialStateProperty.all(Colors.white),
                ),
                child: const Text(
                  'OK',
                  style: TextStyle(
                    fontSize: 18.0,
                  ),
                ),
                onPressed: () {
                  Navigator.of(context).pop();
                  // Navigate to the login page
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: usernameController,
              decoration: const InputDecoration(hintText: 'Username'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: const InputDecoration(hintText: 'Password'),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _signUp,
              child: const Text('Sign Up'),
            )
          ],
        ),
      ),
    );
  }
}
