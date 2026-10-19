import { useEffect } from "react";
import { iniciarScrollSuave } from "../utils/smoothScroll";

export const useSmoothScroll = () => {
    useEffect(() => iniciarScrollSuave(), []);
};
