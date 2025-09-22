import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:qr_flutter/qr_flutter.dart';

class FarmerCreateScreen extends StatefulWidget {
  @override
  _FarmerCreateScreenState createState() => _FarmerCreateScreenState();
}

class _FarmerCreateScreenState extends State<FarmerCreateScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _batchID = TextEditingController();
  final TextEditingController _species = TextEditingController();
  final TextEditingController _farmerID = TextEditingController();
  final TextEditingController _location = TextEditingController();
  final TextEditingController _harvestDate = TextEditingController();

  String? createdBatchJson;

  Future<void> createBatch() async {
    final url = Uri.parse('http://10.0.2.2:3000/api/batches'); // use 10.0.2.2 for Android emulator
    final resp = await http.post(url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'batchID': _batchID.text,
          'species': _species.text,
          'farmerID': _farmerID.text,
          'location': _location.text,
          'harvestDate': _harvestDate.text
        }));
    if (resp.statusCode == 201) {
      setState(() {
        createdBatchJson = resp.body;
      });
    } else {
      final msg = resp.body;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $msg')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Herb Batch')),
      body: Padding(
        padding: EdgeInsets.all(12),
        child: ListView(
          children: [
            Form(
              key: _formKey,
              child: Column(children: [
                TextFormField(controller: _batchID, decoration: InputDecoration(labelText: 'Batch ID')),
                TextFormField(controller: _species, decoration: InputDecoration(labelText: 'Species')),
                TextFormField(controller: _farmerID, decoration: InputDecoration(labelText: 'Farmer ID')),
                TextFormField(controller: _location, decoration: InputDecoration(labelText: 'Location')),
                TextFormField(controller: _harvestDate, decoration: InputDecoration(labelText: 'Harvest Date (YYYY-MM-DD)')),
                SizedBox(height: 12),
                ElevatedButton(onPressed: () {
                  if (_formKey.currentState!.validate()) createBatch();
                }, child: Text('Create Batch'))
              ]),
            ),
            SizedBox(height: 20),
            if (createdBatchJson != null) ...[
              Text('Batch created:'),
              SelectableText(createdBatchJson!),
              SizedBox(height: 12),
              Center(child: QrImage(data: _batchID.text, size: 200)),
            ]
          ],
        ),
      ),
    );
  }
}
