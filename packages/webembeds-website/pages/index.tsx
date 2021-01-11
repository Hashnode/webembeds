import React from "react";
import { GetServerSideProps } from "next";
import axios from "axios";

interface Props {}

function Index(props: Props) {
  const { embedData }: { embedData: { html?: "" } } = props;

  return (
    <div dangerouslySetInnerHTML={{ __html: embedData ? embedData.html : "" }} />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const response = await axios.get(`http://localhost:3000/api/embed?url=${query.url}`);
  console.log(response);
  return {
    props: {
      embedData: JSON.parse(response.data.data),
    },
  };
};

export default Index;
