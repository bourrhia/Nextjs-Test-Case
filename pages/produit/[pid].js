//import React from "react";
import React, { Suspense } from "react";

import Box from "@mui/material/Box";
//import Image from "next/image";
//import Typography from "@mui/material/Typography";
import { getLgimgmrv } from "../api/getlgimgmrv";
import { getSelectedimg } from "../../lib/load_selected_img";
import { useRouter } from "next/router";
//import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
//import CircularProgress from "@mui/material/CircularProgress";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SvgIcon from "@mui/material/SvgIcon";
import { ProdViewXs } from "../../components/Product/ProdViewXs/ProdViewXs";
import { ProdViewUpsm } from "../../components/Product/ProdViewUpsm/ProdViewUpsm";
//import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";

function CustChevronRightIcon(props) {
  return (
    <SvgIcon {...props}>
      <ChevronRightIcon />
    </SvgIcon>
  );
}
export const Prodview = ({ prodselec }) => {
<<<<<<< HEAD
  // const { imgmrv } = props;
  // console.log(selectedprd);

=======
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
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
