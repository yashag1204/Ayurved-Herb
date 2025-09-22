import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ConsumerScanScreen extends StatefulWidget {
  @override
  _ConsumerScanScreenState createState() => _ConsumerScanScreenState();
}

class _ConsumerScanScreenState extends State<ConsumerScanScreen> {
  String? batchDetails;
  String? batchHistory;

  void onDetect(BarcodeCapture capture) async {
    final barcode = capture.barcodes.first.rawValue;
    if (barcode == null) return;
    final id = barcode;
    final baseUrl = 'http://10.0.2.2:3000';
    try {
      final detailResp = await http.get(Uri.parse('$baseUrl/api/batches/$id'));
      final historyResp = await http.get(Uri.parse('$baseUrl/api/batches/$id/history'));
      setState(() {
        batchDetails = detailResp.statusCode == 200 ? detailResp.body : 'Not found';
        batchHistory = historyResp.statusCode == 200 ? historyResp.body : 'No history';
      });
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scan QR / Batch')),
      body: Column(
        children: [
          Container(height: 300, child: MobileScanner(onDetect: onDetect)),
          Expanded(
            child: ListView(
              padding: EdgeInsets.all(12),
              children: [
                Text('Details:', style: TextStyle(fontWeight: FontWeight.bold)),
                if (batchDetails != null) Text(batchDetails!),
                SizedBox(height: 12),
                Text('History:', style: TextStyle(fontWeight: FontWeight.bold)),
                if (batchHistory != null) Text(batchHistory!),
              ],
            ),
          )
        ],
      ),
    );
  }
}
