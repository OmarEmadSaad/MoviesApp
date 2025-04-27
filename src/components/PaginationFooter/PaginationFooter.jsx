import { IconButton, Typography } from "@material-tailwind/react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
const PaginationFooter = ({
  next,
  prev,
  goToFirstPage,
  goToLastPage,
  page,
}) => {
  const totalPages = 500;
  const dispatch = useDispatch();
  return (
    <div className="flex justify-center py-4">
      <div className="flex items-center gap-4 sm:gap-8">
        <IconButton
          size="sm"
          variant="outlined"
          onClick={() => dispatch(goToFirstPage())}
          disabled={page === 1}
          className="text-white">
          <ChevronDoubleLeftIcon
            strokeWidth={2}
            className="h-4 w-4 sm:h-6 sm:w-6"
          />
        </IconButton>
        <IconButton
          size="sm"
          variant="outlined"
          onClick={() => dispatch(prev())}
          disabled={page === 1}
          className="text-white">
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4 sm:h-6 sm:w-6" />
        </IconButton>

        <Typography color="gray" className="font-normal text-white">

          Page <strong className="text-white">{page}</strong> of{" "}
          <strong className="text-white">{totalPages}</strong>
        </Typography>

        <IconButton
          size="sm"
          variant="outlined"
          onClick={() => dispatch(next())}
          disabled={page === totalPages}
          className="text-white">
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4 sm:h-6 sm:w-6" />
        </IconButton>
        <IconButton
          size="sm"
          variant="outlined"
          onClick={() => dispatch(goToLastPage())}
          disabled={page === totalPages}
          className="text-white">
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
