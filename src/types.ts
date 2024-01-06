export type NuAst = {
  type: "ast",
  content: string,
  shape: "shape_internalcall" | "shape_string" | "shape_signature" | "shape_closure" | "shape_garbage" | "shape_block" | "shape_keyword" | "shape_operator",
  span: {
    start: number,
    end: number,
  },
}[];
