export const UNIVERSITY_CONTRACT_ADDRESS = "0x8C74737c2a14b659b94eD2aEE49f51c5221aDdaB"

export const UNIVERSITY_CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStudentCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "studentId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "enrollmentHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "certificateHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "icNumber",
        type: "string",
      },
    ],
    name: "storeStudentData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "studentCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]
