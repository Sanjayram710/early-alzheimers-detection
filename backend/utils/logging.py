import logging
import sys


def setup_logging(debug: bool = True):
    """Configures structured application logging."""
    log_level = logging.DEBUG if debug else logging.INFO
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s:%(lineno)d] - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.handlers = [handler]

    # Silence verbose third-party loggers
    for lib in ["urllib3", "matplotlib", "PIL", "asyncio"]:
        logging.getLogger(lib).setLevel(logging.WARNING)
