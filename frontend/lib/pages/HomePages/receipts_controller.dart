import 'dart:async';
import 'package:digi_receipts/auth_api.dart';
import 'package:flutter_clean_architecture/flutter_clean_architecture.dart';

class ReceiptsController extends Controller {
  final StreamController<List<Receipt>> _receiptsController =
      StreamController<List<Receipt>>.broadcast();
  final AuthApi _authApi = AuthApi(baseUrl: 'http://10.0.2.2:5000');

  Stream<List<Receipt>> get receiptsStream => _receiptsController.stream;

  ReceiptsController() {
    _loadReceipts();
  }

  void _loadReceipts() async {
    var jsonResponse = await _authApi.fetchReceipts();
    if (jsonResponse != null) {
      List<Receipt> receipts = List<Receipt>.from(
          jsonResponse.map((model) => Receipt.fromJson(model)));
      _receiptsController.add(receipts);
    } else {
      // Handle the error or empty case
      _receiptsController.add([]);
    }
  }

  @override
  void initListeners() {
    // Your existing listener initialization
  }
}

class Receipt {
  final int cid;
  final int mid;
  final String time;
  final String qrData;
  final PurchaseDetails purchases;

  Receipt({
    required this.cid,
    required this.mid,
    required this.time,
    required this.qrData,
    required this.purchases,
  });

  factory Receipt.fromJson(Map<String, dynamic> json) {
    return Receipt(
      cid: json['cid'],
      mid: json['mid'],
      qrData: json['qrData'],
      time: json['time'],
      purchases: PurchaseDetails.fromJson(json['purchases']),
    );
  }
}

class PurchaseDetails {
  final List<Item> items;
  final double totalBeforeTax;
  final double gstTotal;
  final double pstTotal;
  final double totalTax;
  final double total;
  final String merchantName;

  PurchaseDetails(
      {required this.items,
      required this.totalBeforeTax,
      required this.gstTotal,
      required this.pstTotal,
      required this.totalTax,
      required this.total,
      required this.merchantName});

  factory PurchaseDetails.fromJson(Map<String, dynamic> json) {
    var itemsFromJson = json['items'] as List<dynamic>;
    List<Item> itemsList =
        itemsFromJson.map((itemJson) => Item.fromJson(itemJson)).toList();

    return PurchaseDetails(
      merchantName: json['merchantName'],
      items: itemsList,
      totalBeforeTax: json['totalBeforeTax'],
      gstTotal: json['gstTotal'],
      pstTotal: json['pstTotal'],
      totalTax: json['totalTax'],
      total: json['total'],
    );
  }
}

class Item {
  final String name;
  final double price;
  final int quantity;
  final double totalPrice;

  Item({
    required this.name,
    required this.price,
    required this.quantity,
    required this.totalPrice,
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    return Item(
        name: json['name'],
        price: json['price'],
        quantity: json['totalNumber'],
        totalPrice: json['totalPrice']);
  }
}
