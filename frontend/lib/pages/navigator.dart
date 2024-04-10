import 'package:digi_receipts/pages/HomePages/profile_page.dart';
import 'package:digi_receipts/pages/HomePages/qr_code_page.dart';
import 'package:digi_receipts/pages/HomePages/receipts_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart'; // For CupertinoIcons
// import 'package:hive/hive.dart';

class NavigatorPage extends StatefulWidget {
  @override
  _NavigatorPageState createState() => _NavigatorPageState();
}

class _NavigatorPageState extends State<NavigatorPage> {
  int currentIndex = 0;
  final List<Widget> _children = [
    QRCodePage(),
    ReceiptsView(),
    ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
//    readSettings();

    return Scaffold(
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.white,
        showSelectedLabels: true, 
        items: [
          BottomNavigationBarItem(
            label: "QR Code",
            icon: Icon(CupertinoIcons.qrcode_viewfinder),
          ),
          BottomNavigationBarItem(
            label: "Receipts",
            icon: Icon(Icons.receipt_long),
          ),
          BottomNavigationBarItem(
            label: "Profile",
            icon: Icon(CupertinoIcons.person),
          ),
        ],
        selectedItemColor: Colors.black,
        unselectedItemColor: Colors.grey,
        currentIndex: currentIndex,
        onTap: (int index) {
          setState(() {
            currentIndex = index;
          });
        },
      ),
      body: IndexedStack(
        index: currentIndex,
        children: _children,
      ),
    );
  }

  // Future<void> readSettings() async {
  //   await Hive.openBox('settings');
  // }
}
