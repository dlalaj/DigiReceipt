import 'dart:async';
import 'dart:convert';
import 'package:flutter_clean_architecture/flutter_clean_architecture.dart';

class ReceiptsController extends Controller {
  final StreamController<List<Receipt>> _receiptsController = StreamController<List<Receipt>>.broadcast();

  Stream<List<Receipt>> get receiptsStream => _receiptsController.stream;

  ReceiptsController() {
    // Simulate loading receipts from a data source
    _loadReceipts();
  }

void _loadReceipts() async {
  await Future.delayed(Duration(seconds: 1));

  // TODO - Hard coded data, fectch from the api
  String jsonData = '''
  [
    {
      "id": "R123456789",
      "title": "Retail Purchase",
      "items": [
        {
          "name": "High Waist Jeans - Original",
          "price": 24.99,
          "quantity": 1,
          "gstAmount": 1.25,
          "pstAmount": 1.75,
          "totalTax": 3.00
        },
        {
          "name": "Cotton T-Shirt - Basic Black",
          "price": 19.99,
          "quantity": 1,
          "gstAmount": 1.00,
          "pstAmount": 1.40,
          "totalTax": 2.40
        }
      ],
      "totalBeforeTax": 44.98,
      "gstTotal": 2.25,
      "pstTotal": 3.15,
      "totalTax": 5.40,
      "total": 50.38,
      "qrCodeData": "https://example.com/receipt/R123456789"
    },
    {
      "id": "R987654321",
      "title": "Electronics Purchase",
      "items": [
        {
          "name": "Wireless Mouse",
          "price": 29.99,
          "quantity": 1,
          "gstAmount": 1.50,
          "pstAmount": 2.10,
          "totalTax": 3.60
        },
        {
          "name": "USB Keyboard",
          "price": 49.99,
          "quantity": 1,
          "gstAmount": 2.50,
          "pstAmount": 3.50,
          "totalTax": 6.00
        }
      ],
      "totalBeforeTax": 79.98,
      "gstTotal": 4.00,
      "pstTotal": 5.60,
      "totalTax": 9.60,
      "total": 89.58,
      "qrCodeData": "https://example.com/receipt/R987654321"
    }
  ]

  ''';

  // Parse the JSON data
  List<dynamic> jsonResponse = json.decode(jsonData);

  // Convert the JSON to a list of Receipts
  List<Receipt> receipts = jsonResponse.map((data) => Receipt.fromJson(data)).toList();

  // Update your controller with the list of receipts
  _receiptsController.add(receipts);
}

  @override
  void initListeners() {}

}




class Receipt {
  final String id;
  final String title;
  final List<Item> items;
  final double totalBeforeTax;
  final double gstTotal;
  final double pstTotal;
  final double totalTax;
  final double total;
  final String qrCodeData;

  Receipt({
    required this.id,
    required this.title,
    required this.items,
    required this.totalBeforeTax,
    required this.gstTotal,
    required this.pstTotal,
    required this.totalTax,
    required this.total,
    required this.qrCodeData,
  });

  factory Receipt.fromJson(Map<String, dynamic> json) {
    var itemsFromJson = json['items'] as List<dynamic>;
    List<Item> itemsList = itemsFromJson.map((itemJson) => Item.fromJson(itemJson)).toList();

    return Receipt(
      id: json['id'],
      title: json['title'],
      items: itemsList,
      totalBeforeTax: json['totalBeforeTax'],
      gstTotal: json['gstTotal'],
      pstTotal: json['pstTotal'],
      totalTax: json['totalTax'],
      total: json['total'],
      qrCodeData: json['qrCodeData'],
    );
  }
}

class Item {
  final String name;
  final double price;
  final int quantity;
  final double gstAmount;
  final double pstAmount;
  final double totalTax;

  Item({
    required this.name,
    required this.price,
    required this.quantity,
    required this.gstAmount,
    required this.pstAmount,
    required this.totalTax,
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    return Item(
      name: json['name'],
      price: json['price'],
      quantity: json['quantity'],
      gstAmount: json['gstAmount'],
      pstAmount: json['pstAmount'],
      totalTax: json['totalTax'],
    );
  }
}
