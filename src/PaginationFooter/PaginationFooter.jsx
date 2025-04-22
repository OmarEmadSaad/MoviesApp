import { IconButton, Typography } from "@material-tailwind/react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const PaginationFooter = () => {
  const [active, setActive] = useState(1);
  const totalPages = 500;

  const next = () => {
    if (active === totalPages) return;
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
  };

  const goToFirstPage = () => {
    setActive(1);
  };

  const goToLastPage = () => {
    setActive(totalPages);
  };

  return (
    <div className="flex justify-center py-4">
      <div className="flex items-center gap-4 sm:gap-8">
        <IconButton
          size="sm"
          variant="outlined"
          onClick={goToFirstPage}
          disabled={active === 1}
          className="text-white"
        >
          <ChevronDoubleLeftIcon
            strokeWidth={2}
            className="h-4 w-4 sm:h-6 sm:w-6"
          />
        </IconButton>

        <IconButton
          size="sm"
          variant="outlined"
          onClick={prev}
          disabled={active === 1}
          className="text-white"
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4 sm:h-6 sm:w-6" />
        </IconButton>

        <Typography color="gray" className="font-normal text-white">
          Page <strong className="text-white">{active}</strong> of{" "}
          <strong className="text-white">{totalPages}</strong>
        </Typography>

        <IconButton
          size="sm"
          variant="outlined"
          onClick={next}
          disabled={active === totalPages}
          className="text-white"
        >
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4 sm:h-6 sm:w-6" />
        </IconButton>

        <IconButton
          size="sm"
          variant="outlined"
          onClick={goToLastPage}
          disabled={active === totalPages}
          className="text-white"
        >
          <ChevronDoubleRightIcon
            strokeWidth={2}
            className="h-4 w-4 sm:h-6 sm:w-6"
          />
        </IconButton>
      </div>
    </div>
  );
};

export default PaginationFooter;
