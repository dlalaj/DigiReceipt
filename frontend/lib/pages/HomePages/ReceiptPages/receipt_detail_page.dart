import 'package:digi_receipts/pages/HomePages/receipts_controller.dart';
import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart'; 

class ReceiptDetailPage extends StatelessWidget {
  final Receipt receipt; 

  const ReceiptDetailPage({Key? key, required this.receipt}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(receipt.title),
        backgroundColor: const Color.fromARGB(255, 255, 255, 255), 
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Items',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              Divider(),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text(
                    'Qnt',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Expanded(
                    child: Text(
                      '   Item',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                  Text(
                    'Price',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              ...receipt.items.map((item) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('  ${item.quantity}      '),
                    Expanded(
                      child: Text(item.name),
                    ),
                    Text('${(item.price * item.quantity + item.gstAmount + item.pstAmount).toStringAsFixed(2)} CAD'),
                  ],
                ),
              )),
              Divider(),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Total before taxes:',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '${receipt.totalBeforeTax.toStringAsFixed(2)} CAD',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'GST Total:',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '${receipt.gstTotal.toStringAsFixed(2)} CAD',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'PST Total:',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '${receipt.pstTotal.toStringAsFixed(2)} CAD',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Divider(),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Total with taxes:',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '${receipt.total.toStringAsFixed(2)} CAD',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              SizedBox(height: 24),
              Center(
                child: QrImageView(
                  data: receipt.qrCodeData,
                  version: QrVersions.auto,
                  size: 200.0,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
