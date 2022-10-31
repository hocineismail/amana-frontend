import React from "react";
import Moment from "react-moment";
import { getCurrentcyFormat } from "../../../utils/getCurrencyFormat";

type Props = {
  item: any;
};

export default function DetailsTransfer({ item }: Props) {
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
      {" "}
      {item.method !== "Baridi Mob" ? (
        <div
          style={{ fontWeight: "bold", margin: "20px 0px", fontSize: "19px" }}
        >
          Receiver details
          {/* {item.method === "Delivery"
            ? "Deflivery Details"
            : "Receiver's details"} */}
        </div>
      ) : null}
      <table className="details-table">
        {item.method !== "Baridi Mob" ? (
          <tr className="details-tr">
            <th className="details-th">Full name:</th>
            <td className="details-td">{item.fullname}</td>
          </tr>
        ) : null}
        {item.method !== "In Office" &&
        item.method !== "Baridi Mob" &&
        item.method !== "Retrait Sans Carte" ? (
          <tr className="details-tr">
            <th className="details-th">Country:</th>
            <td className="details-td">{item.country || "Algeria"}</td>
          </tr>
        ) : null}{" "}
        {item.method !== "In Office" &&
        item.method !== "Retrait Sans Carte" &&
        item.method !== "Baridi Mob" &&
        item.method !== "Mondat Algérie Poste" &&
        item.method !== "Versment ccp" ? (
          <tr className="details-tr">
            <th className="details-th">State:</th>
            <td className="details-td">{item.state || item.delivery_place}</td>
          </tr>
        ) : null}
        {item.method !== "In Office" &&
        item.method !== "Baridi Mob" &&
        item.method !== "Retrait Sans Carte" ? (
          <tr className="details-tr">
            <th className="details-th">Address:</th>
            <td className="details-td">{item.address}</td>
          </tr>
        ) : null}
        {item.method !== "Baridi Mob" ? (
          <tr className="details-tr">
            <th className="details-th">Phone:</th>
            <td className="details-td">+213{item.phone_number}</td>
          </tr>
        ) : null}
      </table>
      <div style={{ fontWeight: "bold", margin: "20px 0px", fontSize: "19px" }}>
        <h2>Transfer details</h2>
      </div>
      <table className="details-table">
        {item.method === "Baridi Mob" ? (
          <tr className="details-tr">
            <th className="details-th"> Baridi Mob:</th>
            <td className="details-td">{item.target_baridiMob?.RIP}</td>
          </tr>
        ) : null}
        {item.method === "Versment ccp" ? (
          <tr className="details-tr">
            <th className="details-th"> CCP:</th>
            <td className="details-td">
              {item.target_ccp?.ccp}/{item.target_ccp?.key}
            </td>
          </tr>
        ) : null}
        <tr className="details-tr">
          <th className="details-th">Description:</th>
          <td className="details-td">{item.description}</td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Relations:</th>
          <td className="details-td">{item.relation}</td>
        </tr>

        {item.type === "Charge" ? (
          <tr className="details-tr">
            <th className="details-th">current country:</th>
            <td className="details-td">{item.current_country}</td>
          </tr>
        ) : null}
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
          <td className="details-td">
            {" "}
            {getCurrentcyFormat({
              currency: "EUR",
              amount: item.exchange_fees,
            })}
          </td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Sent:</th>
          <td className="details-td">
            {" "}
            {getCurrentcyFormat({
              currency: "EUR",
              amount: item.amount - item.exchange_fees,
            })}
          </td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Exchange:</th>
          <td className="details-td">
            {getCurrentcyFormat({
              currency: "EUR",
              amount: 1,
            })}{" "}
            = DA{" "}
            {getCurrentcyFormat({
              currency: "DZD",
              amount: item.exchange,
            })}
          </td>
        </tr>
        {item.method === "Delivery" ? (
          <tr className="details-tr">
            <th className="details-th">Delivery fees:</th>
            <td className="details-td">
              {" "}
              DA{" "}
              {getCurrentcyFormat({
                currency: "DZD",
                amount: item.delivery_price_DZ,
              })}{" "}
            </td>
          </tr>
        ) : null}
        <tr className="details-tr">
          <th className="details-th">Received:</th>
          <td className="details-td">
            {getCurrentcyFormat({
              currency: "DZD",
              amount:
                (item.amount - item.exchange_fees) * item.exchange -
                (item.delivery_price_DZ ? item.delivery_price_DZ : 0),
            })}{" "}
          </td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Status:</th>
          <td className="details-td">
            <b>{item.status}</b>
          </td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Method:</th>
          <td className="details-td">
            <b>{item.method}</b>
          </td>
        </tr>
        {item.method === "By Office" ? (
          <tr className="details-tr">
            <th className="details-th">Office:</th>
            <td className="details-td">
              {item.target_office?.country}, {item.target_office?.address},{" "}
              {item.target_office?.city}
            </td>
          </tr>
        ) : null}
        {item.method === "In Office" ? (
          <tr className="details-tr">
            <th className="details-th">Office:</th>
            <td className="details-td">{item.office}</td>
          </tr>
        ) : null}
        {item.details ? (
          <tr className="details-tr">
            <th className="details-th">Details:</th>
            <td className="details-td">{item.details}</td>
          </tr>
        ) : null}
        <tr className="details-tr">
          <th className="details-th">Date:</th>
          <td className="details-td">
            {" "}
            <Moment format="YYYY-MM-DD HH:mm:ss">
              {item.createdAt?.toDate().toString()}
            </Moment>
          </td>
        </tr>
        <tr className="details-tr">
          <th className="details-th">Notes:</th>
          <td className="details-td">{item.details}</td>
        </tr>
      </table>
    </div>
  );
}
