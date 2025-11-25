import { MutatingDots } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="w-full flex items-center justify-center py-6">
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="var(--primary)"
        secondaryColor="var(--primary)"
        radius="9"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  )
}