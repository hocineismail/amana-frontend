import status from "./status.json";
export default function handler(req, res) {
  res.status(200).json(status);
}
