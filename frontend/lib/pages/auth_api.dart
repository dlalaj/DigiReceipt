import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthApi {
  final String baseUrl;

  AuthApi({required this.baseUrl});

  Future<Map<String, dynamic>?> signUp(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/signup'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      // Handle error
      print('Failed to sign up: ${response.body}');
      return null;
    }
  }

  Future<Map<String, dynamic>?> signIn(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/signin'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      // Handle error
      print('Failed to sign in: ${response.body}');
      return null;
    }
  }
}
