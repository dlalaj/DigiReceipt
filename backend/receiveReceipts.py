# auth.py

from flask import jsonify, request

# Define the route for authentication
def receiveReceipts():
    # Get username and password from the request data
    data = request.json
    merchantID = data.get('merchantID')
    receipt = data.get('receipt')
    userID = data.get('userID')


    print(merchantID)
    print(receipt)
    print(userID)

    return jsonify({'message': 'Got the things successful'}), 200