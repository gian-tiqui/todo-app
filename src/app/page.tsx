import React from "react";
import PageTemplate from "./template/PageTemplate";
import TodosContainer from "./components/TodosContainer";

const IndexPage = () => {
  return (
    <PageTemplate>
      <TodosContainer />
    </PageTemplate>
  );
};

export default IndexPage;
