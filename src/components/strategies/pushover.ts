import config from "../../config";
import * as pending from "../pending";
import * as Push from "pushover-notifications";
import { Request, Response } from "express";

let conf = config.strategies?.pushover;

const push = new Push({
  user: conf.user,
  token: conf.token,
});

export async function initiate(
  token: string,
  strategyData: any,
  identity: string,
  req: Request,
  res: Response
) {
  // resolving user (user device in this case. This could also be fetched from a database)
  let device = identity;

  // send out a notification that redirect the user to /authenticate/{token}
  push.send({
    user: strategyData.user,
    message: `Verification request. Click here.`,
    title: `Verification request. Click here.`,
    url: `${config.url}/finalize?token=${token}`,
    sound: "pushover",
    device: device,
    priority: 1,
  });
}

export async function finalize(req: Request, res: Response) {
  return;
}