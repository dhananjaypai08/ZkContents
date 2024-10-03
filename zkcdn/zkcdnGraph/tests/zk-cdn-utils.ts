import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  ConvertedString,
  Encrypted_CID,
  Mapping,
  Mint,
  OwnershipTransferred,
  Transfer
} from "../generated/ZkCDN/ZkCDN"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createConvertedStringEvent(
  encrypted_cid: BigInt
): ConvertedString {
  let convertedStringEvent = changetype<ConvertedString>(newMockEvent())

  convertedStringEvent.parameters = new Array()

  convertedStringEvent.parameters.push(
    new ethereum.EventParam(
      "encrypted_cid",
      ethereum.Value.fromUnsignedBigInt(encrypted_cid)
    )
  )

  return convertedStringEvent
}

export function createEncrypted_CIDEvent(encrypted_cid: BigInt): Encrypted_CID {
  let encryptedCidEvent = changetype<Encrypted_CID>(newMockEvent())

  encryptedCidEvent.parameters = new Array()

  encryptedCidEvent.parameters.push(
    new ethereum.EventParam(
      "encrypted_cid",
      ethereum.Value.fromUnsignedBigInt(encrypted_cid)
    )
  )

  return encryptedCidEvent
}

export function createMappingEvent(encrypted_cid: BigInt): Mapping {
  let mappingEvent = changetype<Mapping>(newMockEvent())

  mappingEvent.parameters = new Array()

  mappingEvent.parameters.push(
    new ethereum.EventParam(
      "encrypted_cid",
      ethereum.Value.fromUnsignedBigInt(encrypted_cid)
    )
  )

  return mappingEvent
}

export function createMintEvent(to: Address, encrypted_cid: BigInt): Mint {
  let mintEvent = changetype<Mint>(newMockEvent())

  mintEvent.parameters = new Array()

  mintEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  mintEvent.parameters.push(
    new ethereum.EventParam(
      "encrypted_cid",
      ethereum.Value.fromUnsignedBigInt(encrypted_cid)
    )
  )

  return mintEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
