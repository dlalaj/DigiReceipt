import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class QRCodePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('QR Code'),
      ),
      body: Center(
        child: QrImageView(
          data: "https://blogs.ubc.ca/cpen442/",
          version: QrVersions.auto,
          size: 200.0,
        ),
      ),
    );
  }
}
