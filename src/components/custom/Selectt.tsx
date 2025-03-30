import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelecttProps {
  options: string[];
  onChange: (value: string) => void;
  value: string | undefined;
  placeHolder: string;
}

const Selectt = ({ options, onChange, placeHolder, value }: SelecttProps) => {
  return (
    <div className="w-full">
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="w-full rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-md hover:bg-black/30 transition-all duration-300">
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent className="bg-[#171923] text-white border border-white/10 rounded-xl shadow-lg">
          {options.map((item, i) => (
            <SelectItem
              key={i}
              value={item}
              className="hover:bg-white/10 transition-all duration-200 rounded-lg p-2"
            >
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Selectt;