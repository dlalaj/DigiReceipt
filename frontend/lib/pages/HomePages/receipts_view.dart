import 'package:digi_receipts/pages/HomePages/ReceiptPages/receipt_detail_page.dart';
import 'package:digi_receipts/pages/HomePages/receipts_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_clean_architecture/flutter_clean_architecture.dart' as fca;

class ReceiptsView extends fca.View {
  @override
  State<StatefulWidget> createState() => _ReceiptsViewState();
}

class _ReceiptsViewState extends fca.ViewState<ReceiptsView, ReceiptsController> {
  _ReceiptsViewState() : super(ReceiptsController());

  @override
  Widget get view {
    return Scaffold(
      key: globalKey,
      appBar: AppBar(
        title: Text('Receipts'),
      ),
      body: fca.ControlledWidgetBuilder<ReceiptsController>(
        builder: (context, controller) {
          // Update StreamBuilder to work with List<Receipt>
          return StreamBuilder<List<Receipt>>(
            stream: controller.receiptsStream,
            builder: (context, snapshot) {
              if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return Center(child: Text('No receipts found'));
              }
              // Data is now a list of Receipt objects
              List<Receipt> receipts = snapshot.data!;
              return ListView.builder(
                itemCount: receipts.length,
                itemBuilder: (context, index) {
                  Receipt receipt = receipts[index];
                  return InkWell(
                    onTap: () {
                      // Navigate to detail page with the Receipt object
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ReceiptDetailPage(receipt: receipt),
                        ),
                      );
                    },
                    child: Card(
                      child: ListTile(
                        title: Text(receipt.title), // Display the receipt title
                        subtitle: Text('Total: ${receipt.total.toStringAsFixed(2)}'), // Display the total amount
                        // You can add more properties here, like date or ID
                      ),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}

