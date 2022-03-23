var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Customer page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM smartphone",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("smartphone/list", {
          title: "smartphone",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var smartphone= {
        id: req.params.id,
      };

      var delete_sql = "delete from smartphone where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          smartphone,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/smartphone");
            } else {
              req.flash("msg_info", "Sukses Menghapus Smartphone");
              res.redirect("/smartphone");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM smartphone where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/smartphone");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Smartphone can't be find!");
              res.redirect("/smartphone");
            } else {
              console.log(rows);
              res.render("smartphone/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("seri", "Please fill the seri").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_seri = req.sanitize("seri").escape().trim();
      v_prosesor = req.sanitize("prosesor").escape().trim();
      v_jumlah_ram = req.sanitize("jumlah_ram").escape().trim();
      v_worth_it = req.sanitize("worth_it").escape();

      var smartphone = {
        seri: v_seri,
        prosesor: v_prosesor,
        jumlah_ram: v_jumlah_ram,
        worth_it: v_worth_it,
      };

      var update_sql = "update smartphone SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          smartphone,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("smartphone/edit", {
                seri: req.param("seri"),
                prosesor: req.param("prosesor"),
                jumlah_ram: req.param("jumlah_ram"),
                worth_it: req.param("worth_it"),
              });
            } else {
              req.flash("msg_info", "Update smartphone success");
              res.redirect("/smartphone/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/smartphone/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("seri", "Please fill the seri").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_seri = req.sanitize("seri").escape().trim();
    v_prosesor = req.sanitize("prosesor").escape().trim();
    v_jumlah_ram = req.sanitize("jumlah_ram").escape().trim();
    v_worth_it = req.sanitize("worth_it").escape();

    var smartphone = {
      seri: v_seri,
      prosesor: v_prosesor,
      jumlah_ram: v_jumlah_ram,
      worth_it: v_worth_it,
    };

    var insert_sql = "INSERT INTO smartphone SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        smartphone,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("smartphone/add-smartphone", {
              seri: req.param("seri"),
              prosesor: req.param("prosesor"),
              jumlah_ram: req.param("jumlah_ram"),
              worth_it: req.param("worth_it"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Sukses Menambah Smartphone");
            res.redirect("/smartphone");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("smartphone/add-smartphone", {
      seri: req.param("seri"),
      prosesor: req.param("prosesor"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("smartphone/add-smartphone", {
    title: "Add New Smartphone",
    seri: "",
    prosesor: "",
    jumlah_ram: "",
    worth_it: "",
    session_store: req.session,
  });
});

module.exports = router;
