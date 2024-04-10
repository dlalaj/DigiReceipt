import 'dart:io';

import 'package:flutter/material.dart';

import 'pages/login_page.dart';

void main() {
  // This fixes the inability ot use a CA provided certificate - in production this is not safe
  HttpOverrides.global = DevHttpOverrides();
  runApp(const DigiReceipt());
}

class DigiReceipt extends StatelessWidget {
  const DigiReceipt({super.key});


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
class DevHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = (X509Certificate cert, String host, int port) => true;
  }
}
