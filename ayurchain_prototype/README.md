# AyurChain Prototype - Packaged Files

This package contains a lightweight prototype scaffold for the AyurChain project:
- `ayur-chaincode/` - Node.js chaincode (index.js + package.json)
- `ayur-backend/` - Express backend and fabric connector template
- `ayur_flutter_app/` - Flutter app skeleton (pubspec + key lib files)
- `README.md` - this file

IMPORTANT NOTES:
- To run end-to-end you still need Hyperledger Fabric test-network (fabric-samples) and the crypto material.
- Copy `connection-org1.json` from `fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/` into `ayur-backend/`.
- Enroll or copy the `appUser` identity into `ayur-backend/wallet/` for the backend to connect.
- For quick demo without Fabric, consider using the "Mock backend" option (I can provide that next).

Quick commands (high level):
1. Start Fabric test-network (fabric-samples):
   ./network.sh up createChannel -c ayurchannel
2. Deploy chaincode:
   ./network.sh deployCC -ccn ayurtrace -ccp ../../ayur-chaincode -ccl javascript -c ayurchannel
3. Backend:
   cd ayur-backend
   npm install
   node server.js
4. Flutter:
   cd ayur_flutter_app
   flutter pub get
   flutter run

If you'd like, I can now:
- Add the `connection-org1.json` and enrollment scripts into the package (requires fabric-samples output).
- Convert the backend to a mock server so you can demo the Flutter app immediately.
- Provide a zip download (this archive) — already created in the workspace; download link provided by assistant.
