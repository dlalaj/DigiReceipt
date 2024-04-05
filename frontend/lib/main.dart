import 'package:flutter/material.dart';

import 'pages/login_page.dart';

void main() {
  runApp(DigiReceipt());
}

class DigiReceipt extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Login Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const LoginPage(),
    );
  }
}
