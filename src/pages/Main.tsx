import React, { useContext } from "react";
import { MainContext } from "../common/context";
import { IMainContext } from "../interface/interface";

export default function Main(): JSX.Element {
  const context = useContext<IMainContext>(MainContext);
  return (
    <div>
      <h2>{JSON.stringify(context.isUser)}</h2>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>

      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>

      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
    </div>
  );
}
