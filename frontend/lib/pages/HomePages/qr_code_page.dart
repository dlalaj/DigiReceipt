import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import 'package:qr_flutter/qr_flutter.dart';

class QRCodePage extends StatefulWidget {
  const QRCodePage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _QRCodePageState createState() => _QRCodePageState();
}

class _QRCodePageState extends State<QRCodePage> {
  String username = '';
  String currentDate = '';
  String qrData = '';

  @override
  void initState() {
    super.initState();
    loadUserInfo();
    getCurrentDate();
  }

  Future<void> loadUserInfo() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      username = prefs.getString('username') ?? '';
    });
  }

  void getCurrentDate() {
    // Get current date and format it
    currentDate = DateFormat('yyyy-MM-dd').format(DateTime.now());
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Account Information'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const CircleAvatar(
              radius: 50,
              child: Icon(Icons.person, size: 100),
            ),
            const SizedBox(height: 20),
            Text('Welcome, $username!'),
            const SizedBox(height: 10),
            Text('Today\'s Date: $currentDate'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  qrData = 'TESTDATA'; // Set QR code data
                });
              },
              child: const Text('Generate QR Code'),
            ),
            const SizedBox(height: 20),
            if (qrData.isNotEmpty) // Display QR code if data is not empty
              Container(
                padding: const EdgeInsets.all(20.0),
                child: QrImageView(
                  data: qrData,
                  version: QrVersions.auto,
                  size: 200.0,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
