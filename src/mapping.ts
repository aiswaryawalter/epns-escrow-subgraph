import { DepositFunds, EscrowSettled, SellInitiated } from '../generated/Escrow/Escrow'
import { Depositor } from '../generated/schema'
import { sendEPNSNotification } from "./EPNSNotification"

//Note: EPNS supports only The Graph Hosted Service at present

export const subgraphID = "aiswaryawalter/epns-escrow"

export function handleDepositFunds(event: DepositFunds): void {

  let id = event.params.depositor.toHexString() + "-" + event.block.timestamp.toHexString()
  let depositor = Depositor.load(id)
  if (depositor == null) {
    depositor = new Depositor(id)
  }
  depositor.address = event.params.depositor
  depositor.amount = event.params.amount
  depositor.save()

  //notification payload
  let recipient = event.params.depositor.toHexString(),
  type = "3",
  title = "Deposited Successfully",
  body = `${event.params.amount} tokens deposited successfully to EPNS Escrow`,
  subject = "Deposited Successfully",
  message = `${event.params.amount} tokens deposited successfully to EPNS Escrow`,
  image = "https://play-lh.googleusercontent.com/i911_wMmFilaAAOTLvlQJZMXoxBF34BMSzRmascHezvurtslYUgOHamxgEnMXTklsF-S",
  secret = "null",
  cta = "https://epns.io/"

  let notification = `{\"type\": \"${type}\", \"title\": \"${title}\", \"body\": \"${body}\", \"subject\": \"${subject}\", \"message\": \"${message}\", \"image\": \"${image}\", \"secret\": \"${secret}\", \"cta\": \"${cta}\"}`

  sendEPNSNotification (recipient, notification)
 
}


