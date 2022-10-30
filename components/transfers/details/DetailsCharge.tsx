import React from "react";
import Moment from "react-moment";
import { dateIsExpired } from "../../../utils/dateIsExpired";
import { getCurrentcyFormat } from "../../../utils/getCurrencyFormat";

type Props = {
  item: any;
};

export default function DetailsCharge({ item }: Props) {
  if (!item) return <></>;

  return (
    <div
      style={{
        marginTop: "80px",
        height: "80vh",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      <div style={{ fontWeight: "bold", margin: "20px 0px", fontSize: "19px" }}>
        Client details
      </div>
      <table className="details-table">
        <tr className="details-tr">
          <th className="details-th">Full name:</th>
          <td className="details-td">{item.fullname}</td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Country:</th>
          <td className="details-td">{item.country}</td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">State:</th>
          <td className="details-td">{item.state}</td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Address:</th>
          <td className="details-td">{item.address}</td>
        </tr>{" "}
        <tr className="details-tr">
          <th className="details-th">Phone:</th>
          <td className="details-td">{item.phone_number}</td>
        </tr>
      </table>
      <div style={{ fontWeight: "bold", margin: "20px 0px", fontSize: "19px" }}>
        <h2>Transfers details</h2>
      </div>
      <table className="details-table">
        <tr className="details-tr">
          <th className="details-th">Description:</th>
          <td className="details-td">{item.description}</td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Country:</th>
          <td className="details-td">{item.current_country}</td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Amount:</th>
          <td className="details-td">
            {" "}
            {getCurrentcyFormat({
              currency: "EUR",
              amount: item.amount,
            })}
          </td>
        </tr>

        <tr className="details-tr">
          <th className="details-th">Fees:</th>
          <td className="details-td">{item.exchange_fees}</td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Status:</th>
          <td className="details-td">
            {item.status === "Awaiting" &&
            dateIsExpired({
              date: item.createdAt?.toDate().toString(),
            }) ? (
              <b>Canceled</b>
            ) : (
              <b>{item.status}</b>
            )}
          </td>
        </tr>

        <tr className="details-tr">
          <th className="details-th">Method:</th>
          <td className="details-td">
            <b>{item.method === "By Bank" ? "Bank transfer" : "Cash"}</b>
          </td>
        </tr>
        {/* target_bank: {
           bic_swift: 'qsdqsd',
           iban: 'qsdqsd',
           bank_name: 'qsdqsdqsd',
           account_name: 'qsdqsd',
           bank_address: 'qsdqsd' */}

        {item.method === "By Bank" ? (
          <tr className="details-tr">
            <th className="details-th">Bank name:</th>
            <td className="details-td">{item.target_bank.bank_name}</td>
          </tr>
        ) : null}
        {item.method === "By Bank" ? (
          <tr className="details-tr">
            <th className="details-th">Account name:</th>
            <td className="details-td">{item.target_bank.account_name}</td>
          </tr>
        ) : null}
        {item.method === "By Bank" ? (
          <tr className="details-tr">
            <th className="details-th">IBAN:</th>
            <td className="details-td">{item.target_bank.iban}</td>
          </tr>
        ) : null}

        {item.method === "By Bank" ? (
          <tr className="details-tr">
            <th className="details-th">BIC/SWIFT:</th>
            <td className="details-td">{item.target_bank.bic_swift}</td>
          </tr>
        ) : null}
        {item.method === "By Bank" ? (
          <tr className="details-tr">
            <th className="details-th">Reference:</th>
            <td className="details-td">
              {item.referenceName}-{item.referenceNumber}
            </td>
          </tr>
        ) : null}
        {item.method !== "By Bank" ? (
          <tr className="details-tr">
            <th className="details-th">Office:</th>
            <td className="details-td">
              {item.target_office?.country}, {item.target_office?.address},{" "}
              {item.target_office?.city}
            </td>
          </tr>
        ) : null}

        <tr className="details-tr">
          <th className="details-th">Date:</th>
          <td className="details-td">
            {" "}
            <Moment format="YYYY-MM-DD HH:MM:ss">
              {item.createdAt?.toDate().toString()}
            </Moment>
          </td>
        </tr>
      </table>
    </div>
  );
}
