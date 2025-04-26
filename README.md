# Installation and Setup

## Hosted Backend
The API is hosted at: `https://finmo-8po2.onrender.com`

**Note:** We are using a free server, so the first response may be slow while the server wakes up from inactivity.

## Local Setup

1. Clone the repository:
```bash
git clone https://github.com/suchithms19/finmo
cd finmo-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start:dev
```

The server will start at `http://localhost:3000`

## Docker Setup

1. Build the Docker image:
```bash
docker build -t parking-system .
```

2. Run the container:
```bash
docker run -p 3000:3000 parking-system
```

The API will be available at `http://localhost:3000`

## Time Complexity Analysis

The system uses a Min-Heap data structure and Hash Maps for efficient operations. Key complexities:

### Most Important Operations:
- **Park Car (Get Nearest Slot)**: O(log n) - Extract minimum from heap
- **Remove Car**: O(log n) - Insert back into heap
- **Get Car Location by Registration**: O(1) - Hash map lookup

### Additional Operations:
- **Get Slots by Color**: O(k) - Hash map lookup
- **Get All Occupied Slots**: O(n) - Scanning through slots

Where n is the total number of parking slots and k is number of cars of that color.

## API Routes

### 1. Initialize Parking Lot
- **POST** `/parking/initialize`
- **Body**: `{ "size": number }`
- **Response**: `{ "message": string }`

### 2. Expand Parking Lot
- **POST** `/parking/expand`
- **Body**: `{ "additionalSlots": number }`
- **Response**: `{ "message": string }`

### 3. Park a Car
- **POST** `/parking`
- **Body**: `{ "registrationNumber": string, "color": string }`
- **Response**: `{ "slotNumber": number, "registrationNumber": string, "color": string }`

### 4. Remove Car from Slot
- **DELETE** `/parking/:slotNumber`
- **Response**: `{ "message": string }`

### 5. Get Occupied Slots
- **GET** `/parking/occupied`
- **Response**: `{ "totalOccupied": number, "slots": Array<ParkingSlot> }`

### 6. Get Slot by Registration Number
- **GET** `/parking/registration/:registrationNumber`
- **Response**: `{ "slotNumber": number, "registrationNumber": string, "color": string }`

### 7. Get Slots by Color
- **GET** `/parking/color/:color`
- **Response**: `{ "registrationNumbers": string[], "slots": number[] }`

### 8. Get Registration Numbers by Color
- **GET** `/parking/color/:color`
- **Response**: `{ "registrationNumbers": string[], "slots": number[] }`
- *Note: This is handled by getSlotsByColor() - the response includes car details with registration numbers*

## Testing

The project includes comprehensive unit tests for both service and controller layers:

### Running Tests
```bash
# Run all tests
npm test

# Run specific test files
npm test src/parking/services/parking.service.spec.ts
npm test src/parking/controllers/parking.controller.spec.ts

# Run tests with coverage
npm run test:cov
```

### Test Coverage

The tests cover:
- Happy paths (successful operations)
- Edge cases (empty lots, full lots)
- Error conditions (invalid operations)
- Data validation (correct response formats)
- State management (proper initialization)

## Postman Collection

A Postman collection is included for API testing. The collection uses environment variables for base URL configuration:

1. Import `parking-system.postman_collection.json`
2. Set the `baseUrl` variable in your environment
3. Run the requests in sequence starting with initialization

