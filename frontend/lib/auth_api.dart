import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthApi {
  final String baseUrl;

  AuthApi({required this.baseUrl});

  Future<Map<String, dynamic>?> signUp(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/signup'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'username': username, 'password': password}),
    );

    if (response.statusCode == 201) {
      // Success signup - new user was created, can redirect to login page
      log("Success signin ${response.body}");
      final responseData = json.decode(response.body);

      return responseData;
    } else if (response.statusCode == 400) {
      // Handle error
      final responseBody = json.decode(response.body);
      log('Failed to sign up: ${responseBody['error']}');
      return null;
    } else {
      log('Unexpected error occurred!');
      return null;
    }
  }

  Future<Map<String, dynamic>?> signIn(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      log("Success signin ${response.body}");    
      final responseData = json.decode(response.body);
      // Store token, user ID, and username
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', responseData['token']);
      await prefs.setInt('userId', responseData['userId']);
      await prefs.setString('username', username);

      return json.decode(response.body);
    } else {
      // Handle error
      log('Failed to sign in: ${response.body}');
      return null;
    }
  }

  Future<List<dynamic>?> fetchReceipts() async {
    final token = await UserPreferences
        .getToken();
    final userId = await UserPreferences
        .getUserId();

    if (token == null || userId == null) {
      print("UserId or Token not found");
      return null;
    }

    final url = Uri.parse('$baseUrl/query-user-receipt');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization':
            'Bearer $token', // Include the Authorization header with the token
      },
      body: json.encode({
        'cid': userId, // Sending userId in the body
      }),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body) as List<dynamic>;
    } else {
      print('Failed to fetch receipts: ${response.body}');
      return null;
    }
  }
}

class UserPreferences {
  static Future<int?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('userId');
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<String?> getUsername() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('username');
  }
}
