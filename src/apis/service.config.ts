export function GetHeaderConfig(accessToken: string) {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}
