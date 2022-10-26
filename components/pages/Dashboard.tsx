import React from "react";
import Container from "../common/container/Container";
import Layout from "../layout/Layout";
import Transactions from "../wallet/Transactions";

import Switcher from "../wallet/Switcher";
import Wallet from "../wallet/Wallet";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHook";
import { globalState } from "../../features/globalSlice";
import {
  onGetAmountAvailable,
  onGetAmountBlocked,
} from "../../actions/actions";

type Props = {};

export default function Dashboard({}: Props) {
  const { wallet, firstFetch } = useAppSelector(globalState);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (firstFetch) {
      dispatch(onGetAmountBlocked());
      dispatch(onGetAmountAvailable());
    }
  }, [dispatch, firstFetch]);

  return (
    <Layout>
      <>
        <Wallet
          amount={
            Number(wallet.amountAvailable) - Number(wallet.amountBlock) || 0
          }
          amountBlocked={wallet.amountBlock || 0}
        />
        <Container>
          <Switcher />
          <Transactions amountBlocked={wallet.amountBlock || 0} />
        </Container>
      </>
    </Layout>
  );
}
