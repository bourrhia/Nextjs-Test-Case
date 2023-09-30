import React, { Suspense } from "react";

import Box from "@mui/material/Box";

import { getLgimgmrv } from "../api/getlgimgmrv";
import { getSelectedimg } from "../../lib/load_selected_img";
import { useRouter } from "next/router";
import { ProdViewXs } from "../../components/Product/ProdViewXs/ProdViewXs";
import { ProdViewUpsm } from "../../components/Product/ProdViewUpsm/ProdViewUpsm";
import CircularProgress from "@mui/material/CircularProgress";

export const Prodview = ({ prodselec }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
        }}
      >
        <ProdViewXs selectedprd={prodselec} />
      </Box>

      <Box
        sx={{
          display: { xs: "none", sm: "block", md: "block", lg: "block" },
        }}
      >
        <Suspense fallback={<CircularProgress />}>
          <ProdViewUpsm selectedprd={prodselec} />
        </Suspense>
      </Box>
    </Box>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  const lgimgmrventes = JSON.parse(JSON.stringify(await getLgimgmrv()));
  // console.log(lgimgmrventes);

  // Get the paths we want to pre-render based on posts
  const paths = lgimgmrventes.map((image) => ({
    params: { pid: image.imgNum.toString() },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths,
    fallback: "blocking",
  };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const prodselec = JSON.parse(
    JSON.stringify(await getSelectedimg(params.pid))
  );

  if (!prodselec) {
    return {
      notFound: true,
    };
  }

  // Pass post data to the page via props
  return { props: { prodselec }, revalidate: 200 };
}

export default Prodview;
