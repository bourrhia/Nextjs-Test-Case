//import * as React from "react";
import React, { Suspense } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { getLgimgmrv } from "./api/getlgimgmrv";
import { getMdimgmrv } from "./api/getmdimgmrv";
import { getOneimg } from "./api/getoneimg";

import Prdlistsm1 from "../components/Prdlistsm1";
import Prdlistupsm1 from "../components/Prdlistupsm1";

import Prdlistupmd2 from "../components/Prdlistupmd2";
import Prdlistupmd3 from "../components/Prdlistupmd3";
import Prdlistxs1 from "../components/Prdlistxs1";
import Prdlistxs2 from "../components/Prdlistxs2";
import Allprds1 from "../components/Allprds1";
import Allprdxs1 from "../components/Allprdxs1";
import Allprdxs2 from "../components/Allprdxs2";
import Prdselecxs1 from "../components/Prdselecxs1";
import CircularProgress from "@mui/material/CircularProgress";

//

<<<<<<< HEAD
import { useSession } from "next-auth/react";
=======
//import { useSession } from "next-auth/react";
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed

export default function Home(props) {
  const { lgimgmrventes, mdimgmrventes, oneimg } = props;

<<<<<<< HEAD
  const { data: session } = useSession();
=======
  /* const { data: session } = useSession();
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed

  if (session && session.user) {
    console.log("email from index : ", session.user.email);
    console.log("lastname from index : ", session.user.lastname);
    console.log("firstname from index : ", session.user.firstname);
  } else {
    console.log("Session or user is undefined");
<<<<<<< HEAD
  }
=======
  }*/
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed

  return (
    <>
      {/*  Breakpoint only sm */}
      <Box
        sx={{
          display: { xs: "none", sm: "block", md: "none" },
          marginLeft: "32px",
          marginRight: "32px",
          maxWidth: "1248px",
<<<<<<< HEAD

          marginBottom: "64px",
          marginTop: "32px",
          //
          width: "100%",
          height: "100%",
        }}
      >
        <Prdlistsm1 imgmrv={lgimgmrventes} />
        <Prdlistupsm1 imgmrv={lgimgmrventes} />

        <Box
          sx={{
            width: "100%",
            background: "#fff",
            display: "block",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              borderTop: "solid 1px #D5DBDB",
              display: "flex",
            }}
          >
            <Allprds1 imgmrv={lgimgmrventes} />
          </Box>
        </Box>
      </Box>

=======

          marginBottom: "64px",
          marginTop: "32px",
          //
          width: "100%",
          height: "100%",
        }}
      >
        <Prdlistsm1 imgmrv={lgimgmrventes} />
      </Box>

>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
      {/*  Breakpoint up md*/}
      <Box
        sx={{
          display: { xs: "none", sm: "none", md: "block", lg: "block" },
          marginLeft: "32px",
          marginRight: "32px",
          maxWidth: "1248px",

          marginBottom: "64px",
          marginTop: "32px",
          //
          width: "100%",
          height: "100%",
        }}
      >
<<<<<<< HEAD
        <Suspense fallback={<CircularProgress />}>
          <Prdlistupsm1 imgmrv={lgimgmrventes} />
        </Suspense>

        <Prdlistupmd2 imgmrv={lgimgmrventes} />
        <Prdlistupmd3 imgmrv={lgimgmrventes} />
        <Box
          sx={{
            width: "100%",
            background: "#fff",
            display: "block",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              borderTop: "solid 1px #D5DBDB",
              display: "flex",
            }}
          >
            <Allprds1 imgmrv={lgimgmrventes} />
          </Box>
        </Box>
=======
        <Prdlistupsm1 imgmrv={lgimgmrventes} />
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
      </Box>

      {/*  Breakpoint only xs */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          backgroundColor: "#D5DBDB",
          width: "100%",
          minHeight: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              fontSize: "15px",
              marginTop: "-5px",
              fontWeight: 300,

              "&::before,&::after": {
                display: "table",
                content: '""',
                lineHeight: 0,
                fontSize: 0,
              },

              "&::after": {
                clear: "both",
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <Prdlistxs1 imgmrv={mdimgmrventes} />
                <Prdlistxs2 imgmrv={mdimgmrventes} />

                <Box
                  sx={{
                    width: "100%",
                    background: "#fff",
                    display: "block",
                    boxSizing: "border-box",
                  }}
                >
                  <Box
                    sx={{
                      borderTop: "solid 1px #D5DBDB",
                      display: "flex",
                    }}
                  >
                    <Allprds1 imgmrv={lgimgmrventes} />
                  </Box>
                  <Allprdxs1 imgmrv={lgimgmrventes} />
                </Box>

                <Box
                  sx={{
                    outline: 0,
                    WebkitTransition: "margin-left .35s ease-out",
                    transition: "margin-left .35s ease-out",
                  }}
                >
                  <Allprdxs2 imgmrv={lgimgmrventes} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          backgroundColor: "#fff",
        }}
      >
        <Prdselecxs1 imgmrv={oneimg} />
      </Box>
    </>
  );
}
export async function getStaticProps() {
  //const res1 = await fetch("http://localhost:3000/api/getimgunivdp");
  // const res1 = await getImguniversdp();
  //const imguniversdp = await getImguniversdp();

  // const res2 = await fetch("http://localhost:3000/api/getimgpromoj");
  // const imgpromoj = await res2.json();
  // const imgpromoj = await getImgpromoj();

  //const res3 = await fetch("http://localhost:3000/api/getlgimgmrv");
  // const lgimgmrventes = await res3.json();
  //const lgimgmrventes = JSON.stringify(await getLgimgmrv());
  const lgimgmrventes = JSON.parse(JSON.stringify(await getLgimgmrv()));
  const oneimg = JSON.parse(JSON.stringify(await getOneimg()));

  //const res4 = await fetch("http://localhost:3000/api/getmdimgmrv");
  // const mdimgmrventes = await res4.json();
  const mdimgmrventes = JSON.parse(JSON.stringify(await getMdimgmrv()));

  return {
    props: {
      lgimgmrventes,
      oneimg,
      mdimgmrventes,
    },
  };
}
