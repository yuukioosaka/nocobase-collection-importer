# nocobase-collection-importer

A utility script that batch imports collection definitions from JSON files into Nocobase via API, automating collection creation.

## Features

- Reads all JSON files in the `definitions` directory.
- Sends each collection definition to the Nocobase API for creation.
- Logs success and error messages for each collection.

## Requirements

- Node.js (v14 or later recommended)
- A running Nocobase server with API access

## Installation

1. Clone this repository:

   ```
   git clone https://github.com/your-username/nocobase-collection-importer.git
   cd nocobase-collection-importer
   ```

2. Install dependencies:

   ```
   npm install axios
   ```

## How to Get Nocobase API Token

To use this script, you need a Nocobase API token (JWT).  
You can obtain it by logging in to your Nocobase instance via the API:

1. Send a POST request to the login endpoint:

   ```
   POST http://localhost:13000/api/users:login
   Content-Type: application/json

   {
     "username": "your-admin-username",
     "password": "your-admin-password"
   }
   ```

2. The response will include a `token` field.  
   Copy this token and set it as `JWT_TOKEN` in `createCollection.js`.

   Example using `curl`:

   ```
   curl -X POST http://localhost:13000/api/users:login \
     -H "Content-Type: application/json" \
     -d "{\"username\":\"admin\",\"password\":\"admin\"}"
   ```

   The response will look like:

   ```json
   {
     "data": {
       "token": WT"YOUR_J_TOKEN"
     }
   }
   ```

## Usage

1. Create a `definitions` folder in the project root and place your collection definition JSON files inside.

2. Edit `createCollection.js` to set your `API_URL` and `JWT_TOKEN` as needed.

3. Run the script:

   ```
   node createCollection.js
   ```

4. The script will process each JSON file and log the results.

## Notes

- JSON files must follow the Nocobase collection definition format.
- Use a JWT token with admin privileges.

## License

MIT License

---
