export type IPAUserFindResponse = {
  result: {
    result: {
      cn: string[];
      displayname: string[];
      initials: string[];
      gecos: string[];
      departmentnumber: string[];
      employeenumber: string[];
      objectclass: string[];
      ipauniqueid: string[];
      description: string[];
      uid: string[];
      krbcanonicalname: string[];
      uidnumber: string[];
      nsaccountlock: boolean;
      mail: string[];
      homedirectory: string[];
      sn: string[];
      gidnumber: string[];
      krbprincipalname: string[];
      givenname: string[];
      loginshell: string[];
      has_password: boolean;
      has_keytab: boolean;
      dn: string;
    }[];
    count: number;
    truncated: boolean;
    summary: string;
  };
  error: unknown;
  id: number;
  principal: string;
  version: string;
};

export type IPAUserStageAddResponse = {
  result: {
    result: {
      cn: string[];
      displayname: string[];
      initials: string[];
      gecos: string[];
      departmentnumber: string[];
      employeenumber: string[];
      objectclass: string[];
      ipauniqueid: string[];
      description: string[];
      uid: string[];
      krbcanonicalname: string[];
      uidnumber: string[];
      nsaccountlock: boolean;
      mail: string[];
      homedirectory: string[];
      sn: string[];
      gidnumber: string[];
      krbprincipalname: string[];
      givenname: string[];
      loginshell: string[];
      has_password: boolean;
      has_keytab: boolean;
      dn: string;
    };
    value: string;
    summary: string;
  };
  error: unknown;
  id: number;
  principal: string;
  version: string;
};
