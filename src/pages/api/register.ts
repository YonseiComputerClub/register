import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { IPAUserFindResponse, IPAUserStageAddResponse } from "types/Response";
import { authOptions } from "./auth/[...nextauth]";

import Members from "~/../members.json";

export default async function Register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session?.user) {
      res.status(401).end();
      return;
    }

    const userId = session.user.id;
    const userName = session.user.name;
    const userMail = session.user.email;

    if (!(userId && userName && userMail)) {
      res.status(403).end();
      return;
    }

    const { name, studentId, password } = req.body;
    if (!(name && studentId && password)) {
      res.status(400).end();
      return;
    }

    if (
      !Members.find(
        (member) => member.name === name && member.studentId === studentId
      )
    ) {
      res.status(403).json({
        message: "YCC 부원으로 확인되지 않은 사용자입니다.",
      });
      return;
    }

    const params = new URLSearchParams();
    params.append("user", process.env.IPA_SERVER_USERNAME);
    params.append("password", process.env.IPA_SERVER_PASSWORD);

    const loginResult = await axios.post(
      `${process.env.IPA_SERVER_URL}/ipa/session/login_password`,
      params.toString(),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: `${process.env.IPA_SERVER_URL}/ipa/session/login_password`,
        },
      }
    );

    if (!loginResult.headers["set-cookie"]) {
      return "/?error=ipaLoginFailed";
    }

    const ipaCookie = loginResult.headers["set-cookie"][0].split(";")[0];

    const { data: ipaUser } = await axios.post<IPAUserFindResponse>(
      `${process.env.IPA_SERVER_URL}/ipa/session/json`,
      {
        id: 0,
        method: "stageuser_find",
        params: [
          [null],
          {
            all: true,
            raw: false,
            version: "2.251",
            mail: [userMail],
          },
        ],
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cookie: ipaCookie,
          Referer: `${process.env.IPA_SERVER_URL}/ipa`,
        },
      }
    );

    const { data: ipaStagedUser } = await axios.post<IPAUserFindResponse>(
      `${process.env.IPA_SERVER_URL}/ipa/session/json`,
      {
        id: 0,
        method: "user_find",
        params: [
          [null],
          {
            all: true,
            raw: false,
            version: "2.251",
            mail: [userMail],
          },
        ],
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cookie: ipaCookie,
          Referer: `${process.env.IPA_SERVER_URL}/ipa`,
        },
      }
    );

    if (ipaUser.result.result.length !== 0) {
      res.status(409).json({
        message: "이미 등록된 사용자이거나 등록 확인중인 사용자입니다.",
      });
      return;
    }

    if (ipaStagedUser.result.result.length !== 0) {
      res.status(409).json({
        message:
          "등록 확인중인 사용자입니다. 3일 내로 완료되지 않으면 카카오톡으로 문의해주세요",
      });
      return;
    }

    const firstName = name.slice(1);
    const lastName = name[0];

    const username =
      (/^\d+$/.test(userMail.split("@")[0]) ? "y" : "") +
      userMail.split("@")[0];

    await axios.post<IPAUserStageAddResponse>(
      `${process.env.IPA_SERVER_URL}/ipa/session/json`,
      {
        id: 0,
        method: "stageuser_add",
        params: [
          [username],
          {
            all: true,
            raw: false,
            version: "2.251",
            givenname: firstName,
            sn: lastName,
            cn: name,
            displayname: name,
            mail: [userMail],
            employeenumber: studentId,
            departmentnumber: [userId],
            userpassword: password,
          },
        ],
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cookie: ipaCookie,
          Referer: `${process.env.IPA_SERVER_URL}/ipa`,
        },
      }
    );

    res.status(201).json({
      result: true,
    });
    return;
  } catch (e: unknown) {
    res.status(500).end();
  }
}
