import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  ListItem,
  Text,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Image } from "components/Image";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import GitHub from "assets/github.png";

type FormValues = {
  name: string;
  studentId: number;
  password: string;
  passwordConfirm: string;
};

const ErrorMessages = {
  notYonsei: "연세대학교 구글 계정이 아닙니다.",
  alreadyRegistered:
    "이미 등록된 계정입니다. 장시간 기다렸는데도 이 화면이 나온다면 임원진에게 문의해주세요.",
  ipaLoginFailed: "서버 문제가 발생했습니다. 임원진에게 문의해주세요.",
};

export default function MainPage() {
  const router = useRouter();

  const toast = useToast();
  const { status, data } = useSession();

  const [finished, setFinished] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  // OAuth Login Handler
  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const { error } = router.query;

    if (error && typeof error === "string") {
      toast({
        title: "오류",
        description: ErrorMessages[error as keyof typeof ErrorMessages],
        status: "error",
      });

      const url = router.asPath.split("?");
      router.replace(url[0], undefined, { shallow: true });

      return;
    }
  }, [router, toast]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await axios.post("/api/register", {
        name: formData.name,
        studentId: formData.studentId,
        password: formData.password,
      });
      setFinished(true);
    } catch (e: unknown) {
      if (!(axios.isAxiosError(e) && e.response)) {
        console.log(e);
        toast({
          title: "오류",
          description: "알 수 없는 오류가 발생했습니다",
          status: "error",
        });
        return;
      }
      toast({
        title: "오류",
        description: e.response.data.message,
        status: "error",
      });
    }
  });

  return (
    <Center w="full" h="full">
      <Head>
        <title>YCC 계정 등록</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" type="image/png" href="favicon.png" />
      </Head>
      <Center
        w="full"
        maxW="480px"
        p="10"
        display="flex"
        flexDir="column"
        gap="3"
        shadow="xl"
        rounded="xl"
      >
        <Image src="/logo.png" alt="YCC Logo" width="400" height="200" />
        <Heading as="h1" textAlign="center">
          YCC 계정 등록
        </Heading>
        <Text>
          YCC의 서비스들을 이용하기 위해서는 연세대학교 구글 계정 연결이
          필요합니다. YCC에서는 다음과 같은 서비스를 제공하고 있습니다.
        </Text>
        <UnorderedList w="full" ml="10">
          <ListItem>
            <Text fontWeight="bold">Google Meet</Text>
            <UnorderedList>
              <ListItem>시간 제한 없는 모임</ListItem>
              <ListItem>회의 녹화</ListItem>
              <ListItem>소회의실</ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <Link fontWeight="bold" href="https://study.ycc.club">
              YCC 스터디 플랫폼
            </Link>
          </ListItem>
          <ListItem>
            <Link fontWeight="bold" href="https://mail.ycc.club">
              YCC 개인 이메일 (&lt;아이디&gt;@ycc.club)
            </Link>
          </ListItem>
        </UnorderedList>
        <Box
          w="full"
          display={status !== "authenticated" && !finished ? "flex" : "none"}
        >
          <Button
            w="full"
            onClick={async () => await signIn("google")}
            display={status !== "authenticated" ? "flex" : "none"}
            isLoading={status === "loading"}
          >
            @yonsei.ac.kr 계정으로 로그인
          </Button>
        </Box>
        <Box
          w="full"
          as="form"
          gap="3"
          flexDir="column"
          display={status === "authenticated" && !finished ? "flex" : "none"}
          onSubmit={onSubmit}
        >
          <FormControl isRequired>
            <FormLabel>이름</FormLabel>
            <Input {...register("name", { required: "이름을 입력해주세요" })} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>학번</FormLabel>
            <Input
              {...register("studentId", {
                required: "학번을 입력해주세요",
                maxLength: {
                  value: 10,
                  message: "올바르지 않은 학번입니다",
                },
              })}
              type="number"
              __css={{
                "&::-webkit-outer-spin-button": {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
                "&::-webkit-inner-spin-button": {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
                MozAppearance: "textfield",
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>아이디</FormLabel>
            <Input
              autoComplete="username"
              isDisabled
              defaultValue={data?.user.email?.split("@")[0] || ""}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>비밀번호</FormLabel>
            <Input
              type="password"
              autoComplete="new-password"
              {...register("password", { required: "비밀번호를 입력해주세요" })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>비밀번호 확인</FormLabel>
            <Input
              type="password"
              autoComplete="new-password"
              {...register("passwordConfirm", {
                required: "비밀번호 확인을 입력해주세요",
                validate: (value: string) => {
                  if (value !== watch("password")) {
                    return "비밀번호가 일치하지 않습니다";
                  }
                },
              })}
            />
          </FormControl>
          <Button w="full" type="submit" isLoading={isSubmitting}>
            계정 등록
          </Button>
        </Box>
        <Box
          w="full"
          gap="3"
          flexDir="column"
          display={finished ? "flex" : "none"}
        >
          <Text
            color="green.500"
            textAlign="center"
            fontSize="xl"
            fontWeight="bold"
          >
            계정 등록이 완료되었습니다.
          </Text>
          <Text textAlign="center">
            계정 활성화를 위해 YCC 임원진에게 문의해주세요.
          </Text>
        </Box>
        <Divider w="full" />
        <Link
          display="flex"
          href={`https://github.com/${
            process.env.GITHUB_REPO || "maxswjeon/ycc-register"
          }`}
          isExternal
          justifyContent="center"
          alignItems="center"
        >
          <Image
            src={GitHub}
            width="16px"
            height="16px"
            alt="GitHub Logo"
            display="inline"
            mr="1"
          />
          {process.env.GITHUB_REPO || "maxswjeon/ycc-register"}
        </Link>
      </Center>
    </Center>
  );
}
