import 'dart:async';
import 'package:digi_receipts/auth_api.dart';
import 'package:flutter_clean_architecture/flutter_clean_architecture.dart';

class ReceiptsController extends Controller {
  final StreamController<List<Receipt>> _receiptsController = StreamController<List<Receipt>>.broadcast();
  final AuthApi _authApi = AuthApi(baseUrl: 'http://10.0.2.2:5000');
  
  Stream<List<Receipt>> get receiptsStream => _receiptsController.stream;

  ReceiptsController() {
    _loadReceipts();
  }

  void _loadReceipts() async {
    var jsonResponse = await _authApi.fetchReceipts();
    if (jsonResponse != null) {
      List<Receipt> receipts = List<Receipt>.from(jsonResponse.map((model) => Receipt.fromJson(model)));
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
  final String merchantName;
  final int mid;
  final int tid;
  final String time;
  final PurchaseDetails purchases;

  Receipt({
    required this.cid,
    required this.merchantName,
    required this.mid,
    required this.tid,
    required this.time,
    required this.purchases,
  });

  factory Receipt.fromJson(Map<String, dynamic> json) {
    return Receipt(
      cid: json['cid'],
      merchantName: json['merchantName'],
      mid: json['mid'],
      tid: json['tid'],
      time: json['time'],
      purchases: PurchaseDetails.fromJson(json['purchases']),
    );
  }
}

class PurchaseDetails {
  final String title;
  final List<Item> items;
  final double totalBeforeTax;
  final double gstTotal;
  final double pstTotal;
  final double totalTax;
  final double total;
  final String qrCodeData;

  PurchaseDetails({
    required this.title,
    required this.items,
    required this.totalBeforeTax,
    required this.gstTotal,
    required this.pstTotal,
    required this.totalTax,
    required this.total,
    required this.qrCodeData,
  });

  factory PurchaseDetails.fromJson(Map<String, dynamic> json) {
    var itemsFromJson = json['items'] as List<dynamic>;
    List<Item> itemsList = itemsFromJson.map((itemJson) => Item.fromJson(itemJson)).toList();

    return PurchaseDetails(
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
