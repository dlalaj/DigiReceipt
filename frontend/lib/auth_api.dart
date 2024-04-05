import 'dart:convert';
import 'dart:developer';
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

    if (response.statusCode == 201) {
      // Success signup - new user was created, can redirect to login page
      return json.decode(response.body);
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
      return json.decode(response.body);
    } else {
      // Handle error
      log('Failed to sign in: ${response.body}');
      return null;
    }
  }
}
