import 'package:flutter/material.dart';
import 'farmer_create.dart';
import 'consumer_scan.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AyurChain (Prototype)')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton.icon(
              icon: Icon(Icons.agriculture),
              label: Text('Farmer - Create Batch'),
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => FarmerCreateScreen())),
            ),
            SizedBox(height: 16),
            ElevatedButton.icon(
              icon: Icon(Icons.qr_code_scanner),
              label: Text('Scan QR (Consumer / Processor)'),
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ConsumerScanScreen())),
            ),
          ],
        ),
      ),
    );
  }
}
