import Bulb from "@/components/Bulb";

const GridComponent = ({ items }: { items: string[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item: string, index: number) => (
        <div key={index} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow duration-200">
          <Bulb name={item} />
        </div>
      ))}
    </div>
  );
};

export default GridComponent;
