from flask import jsonify, request


def receiveReceipts():

    data = request.json
    merchantID = data.get('merchantID')
    receipt = data.get('receipt')
    userID = data.get('userID')


    print(merchantID)
    print(receipt)
    print(userID)

    return jsonify({'message': 'Got the things successful'}), 200