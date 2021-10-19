export default [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "profileAddr",
				"type": "address"
			}
		],
		"name": "ProfileCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "serviceAddr",
				"type": "address"
			},
			{
				"internalType": "uint16",
				"name": "serviceFeePerc",
				"type": "uint16"
			},
			{
				"internalType": "string",
				"name": "profileUrl",
				"type": "string"
			}
		],
		"name": "createNew",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];