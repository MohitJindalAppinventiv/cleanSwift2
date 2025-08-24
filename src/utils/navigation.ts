// navigateHelper.ts
export let navigate: (path: string) => void;

export const setNavigate = (navFn: typeof navigate) => {
  navigate = navFn;
};
